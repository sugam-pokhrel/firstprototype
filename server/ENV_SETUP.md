# Environment Variables Setup

Create a `.env` file in the `server/` directory with the following content:

```env
PORT=3000
MONGODB_URI=mongodb+srv://sugamf7:yunisha123@pyauto.hkt89gc.mongodb.net/washgo
JWT_SECRET=washgo_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d
```

Or you can use `DATABASE_URL` instead of `MONGODB_URI`:

```env
PORT=3000
DATABASE_URL=mongodb+srv://sugamf7:yunisha123@pyauto.hkt89gc.mongodb.net/washgo
JWT_SECRET=washgo_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d
```

**Note:** The connection string uses MongoDB Atlas (cloud database). Make sure:
- Your IP address is whitelisted in MongoDB Atlas (or use 0.0.0.0/0 for development)
- The database user has proper permissions
- The connection string is correct

