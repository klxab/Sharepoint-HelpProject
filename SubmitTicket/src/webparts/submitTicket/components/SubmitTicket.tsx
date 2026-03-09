import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient } from '@microsoft/sp-http';
import { TextField, Dropdown, IDropdownOption, PrimaryButton, MessageBar, MessageBarType } from '@fluentui/react';
import styles from './SubmitTicket.module.scss';

interface ISubmitTicketProps {
  context: WebPartContext;
}

interface ISubmitTicketState {
  title: string;
  description: string;
  category: string;
  priority: string;
  message: string;
}

export default class SubmitTicket extends React.Component<ISubmitTicketProps, ISubmitTicketState> {
  constructor(props: ISubmitTicketProps) {
    super(props);
    this.state = {
      title: '',
      description: '',
      category: 'Hardware',
      priority: 'Medium',
      message: ''
    };
  }

  private categories: IDropdownOption[] = [
    { key: 'Hardware', text: 'Hardware' },
    { key: 'Software', text: 'Software' },
    { key: 'Network', text: 'Network' },
    { key: 'Account Access', text: 'Account Access' },
    { key: 'Other', text: 'Other' },
  ];

  private priorities: IDropdownOption[] = [
    { key: 'Low', text: 'Low' },
    { key: 'Medium', text: 'Medium' },
    { key: 'High', text: 'High' },
    { key: 'Urgent', text: 'Urgent' },
  ];

  private submitTicket = async () => {
    if (!this.state.title || !this.state.description || !this.state.category) {
      this.setState({ message: 'Please fill all required fields.' });
      return;
    }

    try {
      const ticketNumber = `TICKET-${new Date().getTime()}`;

      const url = `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('ITHelpDeskTickets')/items`;
      const body = {
        Title: this.state.title,
        Description: this.state.description,
        Category: this.state.category,
        Priority: this.state.priority,
        Status: 'Open',
        TicketNumber: ticketNumber
      };

      await this.props.context.spHttpClient.post(
        url,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      this.setState({
        message: `✅ Ticket submitted successfully! Ticket Number: ${ticketNumber}`,
        title: '',
        description: '',
        category: 'Hardware',
        priority: 'Medium'
      });
    } catch (err) {
      console.error(err);
      this.setState({ message: '❌ Error submitting ticket. Check console.' });
    }
  };

  public render(): React.ReactElement<ISubmitTicketProps> {
    return (
      <div className={styles.submitTicketContainer}>
        <h2 className={styles.header}>IT Help Desk - Submit Ticket</h2>

        {this.state.message && (
          <MessageBar
            messageBarType={this.state.message.startsWith('✅') ? MessageBarType.success : MessageBarType.error}
            isMultiline={false}
          >
            {this.state.message}
          </MessageBar>
        )}

        <TextField
          label="Issue Title *"
          value={this.state.title}
          onChange={(e, v) => this.setState({ title: v || '' })}
        />

        <TextField
          label="Description *"
          multiline
          rows={4}
          value={this.state.description}
          onChange={(e, v) => this.setState({ description: v || '' })}
        />

        <Dropdown
          label="Category *"
          selectedKey={this.state.category}
          options={this.categories}
          onChange={(e, option) => this.setState({ category: option?.key as string })}
        />

        <Dropdown
          label="Priority"
          selectedKey={this.state.priority}
          options={this.priorities}
          onChange={(e, option) => this.setState({ priority: option?.key as string })}
        />

        <PrimaryButton text="Submit Ticket" onClick={this.submitTicket} className={styles.submitButton} />
      </div>
    );
  }
}