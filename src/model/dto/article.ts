
export interface UserDto {
  username: string;
}

export interface ArticleDto {
  id: string;
  title: string;
  content: string;
  created: Date;
  likes: number;
}

export interface CommentDto {
  id: string;
  content: string;
  created: Date;
  user: UserDto;
}

export interface ArticleWithCommentsDto extends ArticleDto {
  comments: CommentDto[];
}

export interface CommentWithArticleDto extends CommentDto {
  article: ArticleDto;
}

export interface NewArticleDto {
  title: string;
  content: string;
}

export interface NewCommentDto {
  content: string;
}