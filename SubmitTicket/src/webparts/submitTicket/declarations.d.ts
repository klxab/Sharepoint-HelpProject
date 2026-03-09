declare interface ISubmitTicketModuleScss {
  container: string;
  title: string;
  input: string;
  textarea: string;
  button: string;
  message: string;
}

declare module '*.module.scss' {
  const styles: ISubmitTicketModuleScss;
  export default styles;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}