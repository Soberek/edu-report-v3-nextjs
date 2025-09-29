import React from "react";
import Link from "next/link";
import { Typography } from "@mui/material";
import { REGISTER_CONSTANTS } from "../constants";

/**
 * Component that prompts users to login if they already have an account
 */
export const LoginPrompt: React.FC = () => {
  return (
    <Typography
      align="center"
      variant="body2"
      sx={{
        color: "text.secondary",
        fontWeight: 500,
        letterSpacing: 0.2,
      }}
    >
      {REGISTER_CONSTANTS.TEXT.LOGIN_LINK_TEXT}{" "}
      <Link
        href={REGISTER_CONSTANTS.ROUTES.LOGIN}
        replace
        style={{
          color: REGISTER_CONSTANTS.STYLES.PRIMARY_COLOR,
          textDecoration: "underline",
          fontWeight: 600,
        }}
      >
        {REGISTER_CONSTANTS.TEXT.LOGIN_LINK}
      </Link>
    </Typography>
  );
};
