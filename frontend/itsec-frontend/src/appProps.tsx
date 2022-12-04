export interface User {
  Email: string,
  Token: string
};

export interface CAFFFile {
  CaffID: number,
  CaffName: string,
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

export const defaultCaff: CAFFFile = { CaffID: -1, CaffName: "", bitmap: ""};

export const CAFFs: CAFFFile[] = [
  { CaffID: 1, CaffName: "caff1", bitmap: "logo512.png"},
  { CaffID: 2, CaffName: "caff2", bitmap: "logo512.png"},
  { CaffID: 3, CaffName: "caff3", bitmap: "logo512.png"},
  { CaffID: 4, CaffName: "caff4", bitmap: "logo512.png"},
  { CaffID: 5, CaffName: "caff5", bitmap: "logo512.png"},
  { CaffID: 6, CaffName: "caff6", bitmap: "logo512.png"},
  { CaffID: 7, CaffName: "caff7", bitmap: "logo512.png"},
  { CaffID: 8, CaffName: "caff8", bitmap: "logo512.png"},
  { CaffID: 9, CaffName: "caff9", bitmap: "logo512.png"},
  { CaffID: 10, CaffName: "caff10", bitmap: "logo512.png"},
  { CaffID: 11, CaffName: "caff11", bitmap: "logo512.png"},
  { CaffID: 12, CaffName: "caff12", bitmap: "logo512.png"},
  { CaffID: 13, CaffName: "caff13", bitmap: "logo512.png"},
  { CaffID: 14, CaffName: "caff14", bitmap: "logo512.png"},
  { CaffID: 15, CaffName: "caff15", bitmap: "logo512.png"},
  { CaffID: 16, CaffName: "caff16", bitmap: "logo512.png"},
  { CaffID: 17, CaffName: "caff17", bitmap: "logo512.png"},
  { CaffID: 18, CaffName: "caff18", bitmap: "logo512.png"},
  { CaffID: 19, CaffName: "caff19", bitmap: "logo512.png"},
  { CaffID: 20, CaffName: "caff20", bitmap: "logo512.png"},
  { CaffID: 21, CaffName: "caff21", bitmap: "logo512.png"},
  { CaffID: 22, CaffName: "caff22", bitmap: "logo512.png"},
  { CaffID: 23, CaffName: "caff23", bitmap: "logo512.png"},
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