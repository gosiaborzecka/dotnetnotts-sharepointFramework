import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './SpFxList.module.scss';
import * as strings from 'spFxListStrings';
import { ISpFxListWebPartProps } from './ISpFxListWebPartProps';
import MockHttpClient from './MockHttpClient';

import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

import {
  Environment, 
  EnvironmentType
} from '@microsoft/sp-core-library';

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Localization: string;
  Who: string;
  Date: Date;
}

export default class SpFxListWebPart extends BaseClientSideWebPart<ISpFxListWebPartProps> {

private _renderList(items: ISPList[]):void{
  let html : string = '';
  items.forEach((item: ISPList) => {
    html += `
    <ul class="${styles.list}">
      <li class="${styles.listItem}">
      <h4>${item.Title}</h4>
      <p><a href="https://twitter.com/${item.Who}">@${item.Who}</a> | 
      <a href="https://www.bing.com/maps/default.aspx?q=${item.Localization}">${item.Localization}</a></p>
      </li>
    </ul>
    `;
  });

  const listContainer: Element = this.domElement.querySelector('#spListContainer');
  listContainer.innerHTML = html;
}

private _renderListAsync(): void{
  // Local environment
  if (Environment.type === EnvironmentType.Local) {
    this._getMockListData().then((response) => {
      this._renderList(response.value);
    });
  }
  else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
    this._getListData().then((response) => {
      this._renderList(response.value);
    });
  }
}

private _getListData(): Promise<ISPLists> {
  return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists//getbytitle('SPFx')/Items?$select=*`,
  SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    });
}

  private _getMockListData(): Promise<ISPLists> {
    return MockHttpClient.get()
      .then((data: ISPList[]) => {
        var listData: ISPLists = {value: data};
        return listData;
      }) as Promise<ISPLists>;
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.helloWorld}">
        <div class="${styles.container}">
        <div id="spListContainer" />
        </div>
      </div>`;

      this._renderListAsync();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
