export class DateUtils {
  public static setToStartOfDay(date: Date): Date {
    const output = new Date(date);
    output.setHours(0, 0, 0, 0);

    return output;
  }

  public static diffDate(
    dateString1: string | Date,
    dateString2: string | Date,
  ): number {
    const date1: Date = new Date(dateString1);
    const date2: Date = new Date(dateString2);
    const timeDifference: number = date2.getTime() - date1.getTime();
    const daysDifference: number = Math.ceil(
      timeDifference / (1000 * 3600 * 24),
    );

    return daysDifference;
  }

  public static isDateBeforeToday(dateString: string) {
    const date = new Date(dateString);
    const today = new Date();
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  public static getOnlyDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  public static toStartOfDay(input: string | Date): Date {
    const date = new Date(input);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  public static toEndOfDay(input: string | Date): Date {
    const date = new Date(input);
    date.setHours(23, 59, 59, 999);
    return date;
  }

  public static toShortDate(input: string | Date): string {
    const date = new Date(input);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
}
