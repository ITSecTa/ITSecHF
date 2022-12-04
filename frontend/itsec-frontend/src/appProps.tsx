export interface User {
  Email: string,
  Token: string
};

export interface CAFFFile {
  caffID: string,
  caffName: string,
  bitmap: string,
};

export interface Comment {
  commentID: string,
  text: string
};

export const AppUser: User = {
    Email: "user1@gmail.com",
    Token: "abc123"
};

export const defaultCaff: CAFFFile = { caffID: "", caffName: "", bitmap: ""};

export const DefaultCaffs: CAFFFile[] = [];

export const Comments: Comment[] = [];

export const defaultComment: Comment = { commentID: "default", text: "" };