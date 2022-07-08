const core = require('@actions/core');
const multirelease = require("multi-semantic-release")
const glob = require("glob")
const fs = require('fs')
const process = require('process')

async function run() {
    const packageJSONPath = process.cwd() + "/package.json"

    if (!fs.existsSync(packageJSONPath)) {
        core.setFailed("Missing package.json!")
        return
    }

    const pkgContent = require(packageJSONPath);

    if (!pkgContent.workspaces || pkgContent.workspaces.length < 1) {
        core.error(pkgContent)
        core.setFailed("package.json is missing workspaces!")
        return
    }

    const isDryRun = core.getInput('dry-run') === "true"
    const githubToken = core.getInput('github-token')

    if (!githubToken) {
        core.setFailed("github-token should be a valid github token!");
        return
    }

    process.env.GITHUB_TOKEN = githubToken

    const projects = glob.sync(pkgContent.workspaces[0] + "/package.json")

    const packages = await multirelease(
        projects,
        {},
        {cwd = process.cwd(), env = process.env, stdout = process.stdout, stderr = process.stderr} = {},
        {dryRun: isDryRun, deps: {}}
    )

    const released = packages.filter((pkg) => pkg.result !== false)
        .map((pkg) => {
            return {
                name: pkg.dir.split('/').pop(),
                version: pkg.result.nextRelease.version
            }
        })

    core.setOutput('released-something', released.length > 0)
    core.setOutput('new-versions', released)
}

run()