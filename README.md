sfdx-flow-utils
===============

Flow Utils

[![Version](https://img.shields.io/npm/v/sfdx-flow-utils.svg)](https://npmjs.org/package/sfdx-flow-utils)
[![CircleCI](https://circleci.com/gh/hsaraujo/sfdx-flow-utils/tree/master.svg?style=shield)](https://circleci.com/gh/hsaraujo/sfdx-flow-utils/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/hsaraujo/sfdx-flow-utils?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-flow-utils/branch/master)
[![Greenkeeper](https://badges.greenkeeper.io/hsaraujo/sfdx-flow-utils.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/hsaraujo/sfdx-flow-utils/badge.svg)](https://snyk.io/test/github/hsaraujo/sfdx-flow-utils)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-flow-utils.svg)](https://npmjs.org/package/sfdx-flow-utils)
[![License](https://img.shields.io/npm/l/sfdx-flow-utils.svg)](https://github.com/hsaraujo/sfdx-flow-utils/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-flow-utils
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
sfdx-flow-utils/0.0.1 darwin-arm64 node-v19.7.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx ha:flows:versions:delete -k <integer> [-i <array>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-haflowsversionsdelete--k-integer--i-array--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx ha:flows:versions:delete -k <integer> [-i <array>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

```
USAGE
  $ sfdx ha:flows:versions:delete -k <integer> [-i <array>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -i, --ignore=ignore                                                               [default: ] List of Flow Api names
                                                                                    to ignore

  -k, --keep=keep                                                                   (required) [default: 0] Number of
                                                                                    versions to keep per flow

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/ha/flows/versions/delete.ts](https://github.com/hsaraujo/sfdx-flow-utils/blob/v0.0.1/src/commands/ha/flows/versions/delete.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
