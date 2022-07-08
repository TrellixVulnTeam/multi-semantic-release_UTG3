# Multi-semantic release

This action runs [multi-semantic-release](https://github.com/dhoulb/multi-semantic-release) in your repository.

## Limitations
For now, this action only supports [packages which are defined in the workspaces section in package.json](https://github.com/dhoulb/multi-semantic-release).

## Usage
```
- uses: darksworm/multi-semantic-release@v1
  with:
    # when true, no releases will be made, but outputs will be set. defaults to false
    dry-run: false
    
    # github PAT (personal access token) used to create tags and releases in the repository
    github-token: ''
```

## Outputs
```
released-something 
  true|false 
  whether anything would be (if dry run) or was released

new-versions 
  json array 
  list of packages and their respective versions that were released
  example [{"name":"bar","version":"1.1.0"},{"name":"foo","version":"1.2.0"}]
```
