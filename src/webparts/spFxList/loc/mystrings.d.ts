declare interface ISpFxListStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'spFxListStrings' {
  const strings: ISpFxListStrings;
  export = strings;
}
