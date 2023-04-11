import { format, parseISO } from "date-fns";

const formatDate = (date: string): string =>
  format(parseISO(date), "d-MM-yyyy KK-mm b");

export default formatDate;
