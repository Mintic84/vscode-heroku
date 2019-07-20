import { sync as commandExistsSync } from 'command-exists';
import { commands, ExtensionContext, Uri, window, workspace } from 'vscode';

import HerokuStatus from './components/HerokuStatus';
import linkWorkspace from './lib/linkWorkspace';

const NO_HEROKU_ERROR_ACTION = 'Download and install';
// tslint:disable-next-line: max-line-length
const NO_HEROKU_ERROR_ACTION_URL = 'https://devcenter.heroku.com/articles/heroku-cli#download-and-install';

export async function activate(context: ExtensionContext) {
  // Skip extension start if we can't detect a workspace:
  if (workspace.workspaceFolders === undefined) return;

  // Is Heroku CLI available ?
  if (!commandExistsSync('heroku')) {
    const action = await window.showWarningMessage(
      "Heroku CLI doesn't seem to be installed. Please install it and reload VS Code.",
      NO_HEROKU_ERROR_ACTION,
    );

    if (action === NO_HEROKU_ERROR_ACTION) {
      commands.executeCommand(
        'vscode.open',
        Uri.parse(NO_HEROKU_ERROR_ACTION_URL),
      );
    }

    return;
  }

  new HerokuStatus();

  const linkWorkspaceDisposable = commands.registerCommand(
    'extension.vscode-heroku.linkWorkspace',
    () => linkWorkspace(),
  );

  context.subscriptions.push(linkWorkspaceDisposable);
}

export function deactivate() {}
