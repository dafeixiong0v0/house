import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
  ADMIN = 'admin', // For system administrators
}

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NOT_SUBMITTED = 'not_submitted',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true, unique: true, index: true })
  phone: string;

  @Prop({ type: String, required:false }) // Password might not be required if using OTP for everything
  password?: string;

  @Prop({ type: String, default: 'User' })
  nickname: string;

  @Prop({ type: String, default: null })
  avatar?: string;

  @Prop({ type: [String], enum: UserRole, default: [UserRole.TENANT] })
  roles: UserRole[];

  @Prop({ type: String, default: null })
  realName?: string;

  @Prop({ type: String, default: null })
  idCard?: string; // Store encrypted if sensitive

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String, enum: VerificationStatus, default: VerificationStatus.NOT_SUBMITTED })
  verificationStatus: VerificationStatus;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'House', default: [] })
  favorites: Types.ObjectId[];

  // Timestamps (createdAt, updatedAt) are automatically added by @Schema({ timestamps: true })
  createdAt: Date;
  updatedAt: Date;

  // Method to compare passwords (if password is used)
  async comparePassword(attempt: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(attempt, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash password before saving (if password is provided/changed)
UserSchema.pre<User>('save', async function (next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Ensure phone is unique (MongoDB unique index)
// UserSchema.index({ phone: 1 }, { unique: true }); // Already handled by @Prop unique:true
// You might want more complex indexes depending on query patterns
UserSchema.index({ roles: 1 });
UserSchema.index({ verificationStatus: 1 });
