import app from "./app";
import { connectToDataBase } from "./database";
connectToDataBase()
  .then((res) => {
    if (res) {
      console.log("successfully connected to database");
    }
    return res;
  })
  .then((res) => {
    if (res) {
      app.listen(1000, () => {
        console.log("server  is  running on port 1000");
      });
    }
  })
  .catch((err) => {
    console.log(err.message);
  });
