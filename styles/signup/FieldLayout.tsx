"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const FieldRow = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  "& > *": {
    flex: 1,
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(1),
  },
}));

export const HalfWidthField = styled(Box)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));
