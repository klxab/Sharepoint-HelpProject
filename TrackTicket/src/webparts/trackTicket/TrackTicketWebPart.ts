import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import TrackTicket from './components/TrackTicket';

export interface ITrackTicketWebPartProps {}

export default class TrackTicketWebPart extends BaseClientSideWebPart<ITrackTicketWebPartProps> {
  public render(): void {
    const element = React.createElement(TrackTicket, {
      context: this.context
    });

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}