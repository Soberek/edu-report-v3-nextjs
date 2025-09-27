import React from "react";
import { Tabs, Tab } from "@mui/material";
import { TextFields, Image as ImageIcon, History, Favorite } from "@mui/icons-material";
import { PostTabsProps } from "../types";

/**
 * Component for post generator tabs
 */
export function PostTabs({ activeTab, onTabChange }: PostTabsProps) {
  return (
    <Tabs value={activeTab} onChange={(_, newValue) => onTabChange(newValue)} sx={{ mb: 3 }}>
      <Tab label="Nowy Post" icon={<TextFields />} />
      <Tab label="Moje Posty" icon={<ImageIcon />} />
      <Tab label="Historia" icon={<History />} />
      <Tab label="Ulubione" icon={<Favorite />} />
    </Tabs>
  );
}
