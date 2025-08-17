"use client";

import { TextField, Button, Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";

export const StyledTextField = styled(TextField)(({}) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    "&:hover fieldset": {
      borderColor: "#667eea",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#667eea",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    "&.Mui-focused": {
      color: "#667eea",
    },
  },
}));

export const StyledDatePicker = styled(DatePicker)(({}) => ({
  width: "100%",
  "& .MuiPickersOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    "&:hover fieldset": {
      borderColor: "#667eea",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#667eea",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    "&.Mui-focused": {
      color: "#667eea",
    },
  },
}));

export const StyledSelect = styled(Select)(({}) => ({
  width: "100%",
  "& .MuiSelect-outlined": {
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    "&:hover fieldset": {
      borderColor: "#667eea",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#667eea",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    "&.Mui-focused": {
      color: "#667eea",
    },
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 0),
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: 600,
  "&:hover": {
    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
  },
}));

export const LinkButton = styled(Button)(() => ({
  textTransform: "none",
  color: "#667eea",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "rgba(102, 126, 234, 0.1)",
  },
}));
