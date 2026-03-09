import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ISubmitTicketProps {
  spHttpClient: SPHttpClient;
  pageContext: WebPartContext['pageContext'];
}