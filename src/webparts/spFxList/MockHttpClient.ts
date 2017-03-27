import { ISPList } from './SpFxListWebPart';

export default class MockHttpClient {
    private static _items: ISPList[] = [
        {Title: "Tweet 1 #spfx", Localization: "Nottingham", Who: "nickname", Date: new Date("3/21/2017 9:27 PM")},
        {Title: "Tweet 2 #spfx", Localization: "Derby", Who: "spfx", Date: new Date("2016-03-22 11:23 AM")},
        {Title: "Tweet 3 #spfx", Localization: "Leicester", Who: "userSpfx", Date: new Date("2016-03-27 1:45 PM")}
    ];

    public static get(): Promise<ISPList[]> {
        return new Promise<ISPList[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}