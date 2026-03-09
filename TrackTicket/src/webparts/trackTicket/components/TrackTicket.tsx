import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient } from '@microsoft/sp-http';
import { TextField, PrimaryButton, MessageBar, MessageBarType } from '@fluentui/react';
import styles from './TrackTicket.module.scss';

interface ITrackTicketProps {
  context: WebPartContext;
}

interface ITicket {
  Title: string;
  Description: string;
  Category: string;
  Priority: string;
  Status: string;
  TicketNumber: string;
  SupportNotes?: string;
}

interface ITrackTicketState {
  ticketNumberInput: string;
  ticket: ITicket | null;
  message: string;
}

export default class TrackTicket extends React.Component<ITrackTicketProps, ITrackTicketState> {
  constructor(props: ITrackTicketProps) {
    super(props);
    this.state = {
      ticketNumberInput: '',
      ticket: null,
      message: ''
    };
  }

  private stripHtml = (html: string) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  private fetchTicket = async () => {
    const ticketNumber = this.state.ticketNumberInput.trim();
    if (!ticketNumber) {
      this.setState({ message: 'Please enter your Ticket Number.', ticket: null });
      return;
    }

    try {
      const url = `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('ITHelpDeskTickets')/items?$filter=TicketNumber eq '${ticketNumber}'`;
      const response = await this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
      const data = await response.json();

      if (data.value && data.value.length > 0) {
        this.setState({ ticket: data.value[0], message: '' });
      } else {
        this.setState({ ticket: null, message: '❌ Ticket not found. Check your Ticket Number.' });
      }
    } catch (err) {
      console.error(err);
      this.setState({ ticket: null, message: '❌ Error fetching ticket. Check console.' });
    }
  };

  public render(): React.ReactElement<ITrackTicketProps> {
    const { ticket, message } = this.state;

    return (
      <div className={styles.trackTicketContainer}>
        <h2 className={styles.header}>IT Help Desk - Track Ticket</h2>

        {message && (
          <MessageBar
            messageBarType={message.startsWith('❌') ? MessageBarType.error : MessageBarType.info}
            isMultiline={false}
          >
            {message}
          </MessageBar>
        )}

        <TextField
          label="Enter your Ticket Number"
          placeholder="TICKET-123456789"
          value={this.state.ticketNumberInput}
          onChange={(e, v) => this.setState({ ticketNumberInput: v || '' })}
        />

        <PrimaryButton
          text="Track Ticket"
          onClick={this.fetchTicket}
          className={styles.trackButton}
        />

        {ticket && (
          <div className={styles.ticketDetails}>
            <h3>Ticket Details</h3>
            <p><strong>Ticket Number:</strong> {ticket.TicketNumber}</p>
            <p><strong>Title:</strong> {ticket.Title}</p>
            <p><strong>Description:</strong> {this.stripHtml(ticket.Description)}</p>
            <p><strong>Category:</strong> {ticket.Category}</p>
            <p><strong>Priority:</strong> {ticket.Priority}</p>
            <p><strong>Status:</strong> {ticket.Status}</p>
            {ticket.SupportNotes && (
              <p><strong>Support Notes:</strong> {this.stripHtml(ticket.SupportNotes)}</p>
            )}
          </div>
        )}
      </div>
    );
  }
}