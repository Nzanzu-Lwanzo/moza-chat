export const formatUserName = (name: string | undefined): string => {
  if (!name) return "Anonymous";

  const [first, last] = name.split(" ");

  let completeName: string;

  if (first && last) {
    completeName = `${first[0]}. ${last}`;
  } else if (!first && last) {
    completeName = last;
  } else if (!last && first) {
    completeName = first;
  } else {
    completeName = "Anonymous";
  }

  return completeName;
};

export const formatDate = (
  dateString: string | undefined,
  includeTime: boolean = false
): string => {
  const date = dateString ? new Date(dateString) : new Date();

  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  let hours = date.getHours();
  let mins = date.getMinutes();

  let time = `${hours}:${mins > 9 ? mins : "0".concat(mins.toString())}`;

  return `${day}.${month}.${year} à ${includeTime ? time : ""}`;
};
