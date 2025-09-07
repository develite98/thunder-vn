export interface IHomeBanner {
  created_by: string;
  id: number;
  title: string;
  description: string;
  image: string;
  cta_button_text: string;
  cta_button_url: string;
  created_date_time: string;
}

export interface ISocialNetwork {
  id: number;
  display_name: string;
  icon: string;
  link: string;
  priority: number;
}
