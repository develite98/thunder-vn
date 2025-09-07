import { EDataType } from '@mixcore/sdk-client';

export interface IDataTypeDisplay {
  icon: string;
  displayName: string;
  color: string;
}

export const DATA_TYPE_DISPLAY: Record<EDataType, IDataTypeDisplay> = {
  [EDataType.String]: {
    icon: 'type',
    displayName: 'dataType.displayName.String',
    color: '#ff9e00',
  },
  [EDataType.Custom]: {
    icon: 'puzzle',
    displayName: 'dataType.displayName.Custom',
    color: '#6c757d',
  },
  [EDataType.DateTime]: {
    icon: 'calendar-clock',
    displayName: 'dataType.displayName.DateTime',
    color: '#007bff',
  },
  [EDataType.Date]: {
    icon: 'calendar',
    displayName: 'dataType.displayName.Date',
    color: '#17a2b8',
  },
  [EDataType.Time]: {
    icon: 'clock',
    displayName: 'dataType.displayName.Time',
    color: '#ffc107',
  },
  [EDataType.DateTimeLocal]: {
    icon: 'calendar-range',
    displayName: 'dataType.displayName.DateTimeLocal',
    color: '#6f42c1',
  },
  [EDataType.Duration]: {
    icon: 'timer',
    displayName: 'dataType.displayName.Duration',
    color: '#e83e8c',
  },
  [EDataType.PhoneNumber]: {
    icon: 'phone',
    displayName: 'dataType.displayName.PhoneNumber',
    color: '#28a745',
  },
  [EDataType.Double]: {
    icon: 'hash',
    displayName: 'dataType.displayName.Double',
    color: '#20c997',
  },
  [EDataType.Text]: {
    icon: 'text',
    displayName: 'dataType.displayName.Text',
    color: '#4bbbf9',
  },
  [EDataType.Html]: {
    icon: 'code',
    displayName: 'dataType.displayName.Html',
    color: '#fd7e14',
  },
  [EDataType.MultilineText]: {
    icon: 'file-text',
    displayName: 'dataType.displayName.MultilineText',
    color: '#adb5bd',
  },
  [EDataType.EmailAddress]: {
    icon: 'mail',
    displayName: 'dataType.displayName.EmailAddress',
    color: '#17a2b8',
  },
  [EDataType.Password]: {
    icon: 'lock',
    displayName: 'dataType.displayName.Password',
    color: '#6c757d',
  },
  [EDataType.Url]: {
    icon: 'link',
    displayName: 'dataType.displayName.Url',
    color: '#0d6efd',
  },
  [EDataType.ImageUrl]: {
    icon: 'image',
    displayName: 'dataType.displayName.ImageUrl',
    color: '#6610f2',
  },
  [EDataType.CreditCard]: {
    icon: 'credit-card',
    displayName: 'dataType.displayName.CreditCard',
    color: '#dc3545',
  },
  [EDataType.PostalCode]: {
    icon: 'map-pin',
    displayName: 'dataType.displayName.PostalCode',
    color: '#fd7e14',
  },
  [EDataType.Upload]: {
    icon: 'upload',
    displayName: 'dataType.displayName.Upload',
    color: '#20c997',
  },
  [EDataType.Color]: {
    icon: 'palette',
    displayName: 'dataType.displayName.Color',
    color: '#d63384',
  },
  [EDataType.Boolean]: {
    icon: 'circle-check',
    displayName: 'dataType.displayName.Boolean',
    color: '#198754',
  },
  [EDataType.Icon]: {
    icon: 'star',
    displayName: 'dataType.displayName.Icon',
    color: '#f39c12',
  },
  [EDataType.VideoYoutube]: {
    icon: 'youtube',
    displayName: 'dataType.displayName.VideoYoutube',
    color: '#dc3545',
  },
  [EDataType.TuiEditor]: {
    icon: 'edit',
    displayName: 'dataType.displayName.TuiEditor',
    color: '#0d6efd',
  },
  [EDataType.Integer]: {
    icon: 'hash',
    displayName: 'dataType.displayName.Integer',
    color: '#f0b100',
  },
  [EDataType.Guid]: {
    icon: 'key',
    displayName: 'dataType.displayName.Guid',
    color: '#6f42c1',
  },
  [EDataType.Reference]: {
    icon: 'book-open',
    displayName: 'dataType.displayName.Reference',
    color: '#6c757d',
  },
  [EDataType.QRCode]: {
    icon: 'scan-line',
    displayName: 'dataType.displayName.QRCode',
    color: '#6610f2',
  },
  [EDataType.Tag]: {
    icon: 'tag',
    displayName: 'dataType.displayName.Tag',
    color: '#20c997',
  },
  [EDataType.Json]: {
    icon: 'braces',
    displayName: 'dataType.displayName.Json',
    color: '#198754',
  },
  [EDataType.Array]: {
    icon: 'list',
    displayName: 'dataType.displayName.Array',
    color: '#fd7e14',
  },
  [EDataType.ArrayMedia]: {
    icon: 'images',
    displayName: 'dataType.displayName.ArrayMedia',
    color: '#d63384',
  },
  [EDataType.ArrayRadio]: {
    icon: 'radio',
    displayName: 'dataType.displayName.ArrayRadio',
    color: '#ffc107',
  },
  [EDataType.Long]: {
    icon: 'hash',
    displayName: 'dataType.displayName.Long',
    color: '#6c757d',
  },
};
