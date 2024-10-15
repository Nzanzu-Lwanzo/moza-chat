const formatUserName = (name: string | undefined): string => {
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

export { formatUserName };
