export const colors = [
  "Select Material",
  "Any",
  "Yellow",
  "Blue",
  "Purple",
  "Black",
  "Teal",
  "White",
];
export const printers = [
  "Select Printer",
  "Any",
  "Prusa",
  "Bambu Lab",
];
//also controls the collumns that are displayed
export const literalToPrettyName = {
  none: "View",
  name: "Job Name",
  date: "Date",
  userId: "SSID",
  cost: "Est. Cost",
  printTime: "Est. Time",
  printer: "Printer",
  color: "Color",
} as {
  [key: string]: string;
};
//remebmer to add the new status to the tailwind safelist
export const statusColors = {
  "submited": "bg-yellow-300",
  "printing": "bg-blue-300",
  "complete": "bg-green-300",
  "rejected": "bg-red-300",
} as {
  [key: string]: string
}
