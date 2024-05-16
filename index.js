import express from "express";
import bodyParser from "body-parser";

import usersRoutes from "./routes/routes.js";
//import menuRoutes from "./routes/menu.js";
//import categoryRoutes from "./routes/category.js";
//import favoriteRoutes from "./routes/favorite.js";
//import notificationRoutes from "./routes/notification.js";
//import orderRoutes from "./routes/order.js";
//import restaurantRoutes from "./routes/restaurant.js";

const app = express();
const port = 3000;

app.use("/users", usersRoutes);
app.use("/menu", menuRoutes);
app.use("/categories", categoryRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/notifications", notificationRoutes);
app.use("/orders", orderRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log("server running on port 3000");
});
