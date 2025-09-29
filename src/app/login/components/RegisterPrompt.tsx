import React from "react";
import Link from "next/link";
import { Typography, Link as MuiLink } from "@mui/material";
import { LOGIN_CONSTANTS } from "../constants";

/**
 * Component that prompts users to register if they don't have an account
 */
export const RegisterPrompt: React.FC = () => {
  return (
    <Typography
      variant="body2"
      textAlign="center"
      color="text.secondary"
      sx={{
        fontWeight: 500,
        letterSpacing: 0.2,
      }}
    >
      {LOGIN_CONSTANTS.TEXT.REGISTER_LINK_TEXT}{" "}
      <MuiLink
        component={Link}
        href={LOGIN_CONSTANTS.ROUTES.REGISTER}
        underline="none"
        color="primary"
        fontWeight={500}
        sx={{
          color: LOGIN_CONSTANTS.STYLES.PRIMARY_COLOR,
          textDecoration: "underline",
          "&:hover": {
            textDecoration: "none",
          },
        }}
      >
        {LOGIN_CONSTANTS.TEXT.REGISTER_LINK}
      </MuiLink>
    </Typography>
  );
};
