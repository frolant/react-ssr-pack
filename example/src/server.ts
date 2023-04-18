import runAppServer from './utils/runAppServer';
import serverAppRender from './renders/serverAppRender';
import appConfig from './constants/appConfig';

runAppServer(serverAppRender, appConfig);
