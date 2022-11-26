export interface User {
  Name: string,
  Password: string
};

export interface CAFFFile {
  Id: number,
  Name: string,
  Price: number,
  Source: string,
};

export const AppUser: User = {
    Name: "user1",
    Password: "fafaf"
};

export const defaultCaff: CAFFFile = { Id: -1, Name: "", Price: -1, Source: ""};

export const CAFFs: CAFFFile[] = [
  { Id: 1, Name: "caff1", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 2, Name: "caff2", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 3, Name: "caff3", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 4, Name: "caff4", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 5, Name: "caff5", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 6, Name: "caff6", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 7, Name: "caff7", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 8, Name: "caff8", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 9, Name: "caff9", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 10, Name: "caff10", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 11, Name: "caff11", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 12, Name: "caff12", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 13, Name: "caff13", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 14, Name: "caff14", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 15, Name: "caff15", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 16, Name: "caff16", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 17, Name: "caff17", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 18, Name: "caff18", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 19, Name: "caff19", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 20, Name: "caff20", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 21, Name: "caff21", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 22, Name: "caff22", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
  { Id: 23, Name: "caff23", Price: (Math.random() * (10000 - 100) + 100), Source: "logo512.png"},
];