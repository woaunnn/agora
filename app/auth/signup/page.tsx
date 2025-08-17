"use client";

import React, { useState } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  IconButton,
  InputAdornment,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import dayjs from "dayjs";
import "dayjs/locale/th";

import {
  AuthContainer,
  AuthCard,
  AuthCardContent,
} from "../../../styles/common/AuthCard";
import {
  StyledTextField,
  StyledButton,
  LinkButton,
  StyledDatePicker,
  StyledSelect,
} from "../../../styles/common/FormComponents";
import { SignUpTitle, SignUpForm } from "../../../styles/signup/SignUpStyles";
import { FieldRow } from "../../../styles/signup/FieldLayout";

// Schema สำหรับ validation
const signUpSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("กรุณากรอกชื่อ")
    .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(50, "ชื่อต้องไม่เกิน 50 ตัวอักษร"),
  lastName: yup
    .string()
    .required("กรุณากรอกนามสกุล")
    .min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(50, "นามสกุลต้องไม่เกิน 50 ตัวอักษร"),
  email: yup.string().required("กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
  phoneNumber: yup
    .string()
    .required("กรุณากรอกเบอร์โทรศัพท์")
    .matches(/^[0-9]{10}$/, "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก"),
  birthDate: yup
    .date()
    .nullable()
    .required("กรุณาเลือกวันเกิด")
    .max(new Date(), "วันเกิดต้องไม่เกินวันปัจจุบัน")
    .test("age", "อายุต้องมากกว่า 13 ปี", function (value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= 13;
      }
      return age >= 13;
    }) as yup.Schema<Date | null>,
  gender: yup
    .number()
    .required("กรุณาเลือกเพศ")
    .oneOf([1, 2, 3], "กรุณาเลือกเพศที่ถูกต้อง"),
  password: yup
    .string()
    .required("กรุณากรอกรหัสผ่าน")
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
    // .matches(/(?=.*[a-z])/, "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว")
    // .matches(/(?=.*[A-Z])/, "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว")
    // .matches(/(?=.*[0-9])/, "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว")
    ,
  confirmPassword: yup
    .string()
    .required("กรุณายืนยันรหัสผ่าน")
    .oneOf([yup.ref("password")], "รหัสผ่านไม่ตรงกัน"),
});

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: Date | null;
  gender: number;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  // const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      birthDate: null,
      gender: 1,
      password: "",
      confirmPassword: "",
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setSubmitError("");

    try {
      console.log(`[Tawan] LOG: data ---> `,data)
      // const result = await ClientAuthService.signUp({
      //   email: data.email,
      //   password: data.password,
      //   firstName: data.firstName,
      //   lastName: data.lastName,
      // });

      // if (result.success) {
      //   router.push("/dashboard");
      // } else {
      //   setSubmitError(result.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      // }
    } catch {
      setSubmitError("เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
      <AuthContainer>
        <AuthCard>
          <AuthCardContent>
            <SignUpTitle>Sign up</SignUpTitle>

            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}

            <SignUpForm onSubmit={handleSubmit(onSubmit)}>
              {/* ชื่อและนามสกุล */}
              <FieldRow>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      style={{ margin: "0 8px 0 0" }}
                      label="ชื่อ"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      disabled={loading}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      label="นามสกุล"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      disabled={loading}
                    />
                  )}
                />
              </FieldRow>

              {/* อีเมล */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    label="อีเมล"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={loading}
                  />
                )}
              />

              {/* เบอร์โทรศัพท์ */}
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    label="เบอร์โทรศัพท์"
                    placeholder="0812345678"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    disabled={loading}
                  />
                )}
              />

              {/* วันเกิดและเพศ */}
              <FieldRow>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <StyledDatePicker
                      {...field}
                      label="วันเกิด"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) =>
                        field.onChange(date?.toDate() || null)
                      }
                      disabled={loading}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.birthDate,
                          helperText: errors.birthDate?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.gender}>
                      <InputLabel>เพศ</InputLabel>
                      <StyledSelect
                        {...field}
                        label="เพศ"
                        disabled={loading}
                        sx={{
                          borderRadius: 3,
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#667eea",
                          },
                        }}
                      >
                        <MenuItem value={1}>ชาย</MenuItem>
                        <MenuItem value={2}>หญิง</MenuItem>
                        <MenuItem value={3}>อื่นๆ</MenuItem>
                      </StyledSelect>
                      {errors.gender && (
                        <FormHelperText>{errors.gender.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </FieldRow>

              {/* รหัสผ่าน */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    label="รหัสผ่าน"
                    type={showPassword ? "text" : "password"}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            disabled={loading}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {/* ยืนยันรหัสผ่าน */}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    {...field}
                    fullWidth
                    label="ยืนยันรหัสผ่าน"
                    type={showConfirmPassword ? "text" : "password"}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            disabled={loading}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? "Loading..." : "Sign up"}
              </StyledButton>
            </SignUpForm>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Link href="/auth/signin" passHref>
                <LinkButton disabled={loading}>
                  Already have an account? Sign in
                </LinkButton>
              </Link>
            </Box>
          </AuthCardContent>
        </AuthCard>
      </AuthContainer>
    </LocalizationProvider>
  );
};

export default SignUp;
