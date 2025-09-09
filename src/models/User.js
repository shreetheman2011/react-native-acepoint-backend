import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user","admin"], default: "user" },

    // 🟢 Tennis-specific profile fields (all optional for backward compat)
    utr: { type: Number, min: 0, max: 20 },
    handedness: { type: String, enum: ["left","right"], default: undefined },
    backhand: { type: String, enum: ["one-handed","two-handed"], default: undefined },
    playStyle: { type: String, enum: ["baseliner","all-court","counterpuncher","serve-volley","aggressive-baseliner"], default: undefined },
    favoriteSurface: { type: String, enum: ["hard","clay","grass","other"], default: undefined },
    city: { type: String },
    bio: { type: String, maxlength: 500 },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

//hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//compare password func
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
