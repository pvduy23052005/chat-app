import { Response, Request } from 'express';

export const create = (req: Request, res: Response) => {

  // const listFried = res.locals.user.friendsList;
  // console.log(listFried);

  console.log(res.locals.user);
  res.render("pages/room/create", {
    title: "Tạo mới phòng"
  });
}