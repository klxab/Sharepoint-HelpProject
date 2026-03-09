import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import SubmitTicket from './components/SubmitTicket';

export interface ISubmitTicketWebPartProps {}

export default class SubmitTicketWebPart extends BaseClientSideWebPart<ISubmitTicketWebPartProps> {
  public render(): void {
    const element: React.ReactElement = React.createElement(SubmitTicket, {
      context: this.context
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}