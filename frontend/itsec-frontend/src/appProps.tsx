export interface User {
  Email: string,
  Token: string
};

export interface CAFFFile {
  Id: number,
  CaffName: string,
  Price: number,
  bitmap: string,
};

export interface Comment {
  CommentID: number,
  Text: string
};

export const AppUser: User = {
    Email: "user1@gmail.com",
    Token: "abc123"
};

export const defaultCaff: CAFFFile = { Id: -1, CaffName: "", Price: -1, bitmap: ""};

export const CAFFs: CAFFFile[] = [
  { Id: 1, CaffName: "caff1", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 2, CaffName: "caff2", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 3, CaffName: "caff3", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 4, CaffName: "caff4", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 5, CaffName: "caff5", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 6, CaffName: "caff6", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 7, CaffName: "caff7", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 8, CaffName: "caff8", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 9, CaffName: "caff9", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 10, CaffName: "caff10", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 11, CaffName: "caff11", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 12, CaffName: "caff12", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 13, CaffName: "caff13", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 14, CaffName: "caff14", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 15, CaffName: "caff15", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 16, CaffName: "caff16", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 17, CaffName: "caff17", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 18, CaffName: "caff18", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 19, CaffName: "caff19", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 20, CaffName: "caff20", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 21, CaffName: "caff21", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 22, CaffName: "caff22", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
  { Id: 23, CaffName: "caff23", Price: (Math.random() * (10000 - 100) + 100), bitmap: "logo512.png"},
];

export const Comments: Comment[] = [
  { CommentID: 1, Text: "Some comment" },
  { CommentID: 1, Text: "Short comment"},
  { CommentID: 1, Text: "Very long comenttg sgjaglna glnagjag jagalgbagb aglblgb algbalgbalgba lgbalgbalgbal gbalgbal bgalgblagla gblagab"},
  { CommentID: 1, Text: "Multi\nLine\nComment"},
  { CommentID: 1, Text: "Some comment"},
  { CommentID: 1, Text: "Multi\nLine\nComment"},
  { CommentID: 1, Text: "Some comment"},
  { CommentID: 1, Text: "Very long comentt gs gjaglnag lnagjagj agalgbagbagl blgbalgba lgbalgbalgbal gbalgbalgba lgbalbg algblagl agblagab"},
  { CommentID: 1, Text: "Some comment"},
  { CommentID: 1, Text: "Multi\nLine\nComment"},
  { CommentID: 1, Text: "Some comment"},
  { CommentID: 1, Text: "Short comment"},
];

export const defaultComment: Comment = { CommentID: 0, Text: "" };