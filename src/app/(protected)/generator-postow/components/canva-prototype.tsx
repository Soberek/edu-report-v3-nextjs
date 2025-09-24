import { Box, InputLabel, TextField, Typography } from "@mui/material";
import { useReducer } from "react";

const containerDimensions = {
  width: 849,
  height: 788,
};

type State = {
  img: string | ArrayBuffer | null;
  imgFileName: string | null;
};

type Action = { type: "SET_IMAGE"; payload: { img: string | ArrayBuffer; fileName: string } } | { type: "CLEAR_IMAGE" };

const initialState: State = {
  img: null,
  imgFileName: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_IMAGE":
      return { ...state, img: action.payload.img, imgFileName: action.payload.fileName };
    case "CLEAR_IMAGE":
      return { ...state, img: null, imgFileName: null };
    default:
      return state;
  }
}

export const Canva = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (result) {
        // readAsDataURL produces a string, but keep type flexible
        dispatch({ type: "SET_IMAGE", payload: { img: result, fileName: file.name } });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Box sx={{ my: 2, textAlign: "center" }}>
        <InputLabel
          htmlFor="file-upload"
          sx={{
            display: "inline-block",
            px: 3,
            py: 1.5,
            backgroundColor: "primary.main",
            color: "white",
            borderRadius: 2,
            cursor: "pointer",
            fontWeight: "medium",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "primary.dark",
              transform: "translateY(-1px)",
            },
          }}
        >
          Wybierz obrazek
        </InputLabel>
        {state.img && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "text.secondary",
              fontStyle: "italic",
            }}
          >
            {state.imgFileName ? `Plik załadowany ${state.imgFileName}` : "Brak pliku"}
          </Typography>
        )}
      </Box>
      <TextField
        id="file-upload"
        type="file"
        inputProps={{ accept: "image/*" }}
        sx={{
          display: "none",
        }}
        onChange={handleFileChange}
      />

      <Box
        sx={{
          width: containerDimensions.width,
          height: containerDimensions.height,
          border: "1px solid black",
          backgroundColor: "white",
          borderRadius: "16px",
          mx: "auto",
          my: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Image Container */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            right: "50px",
            width: "40%",
            height: "80%",
            border: "1px solid red",
            borderRadius: "16px",
            backgroundImage: `url(${state.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
          }}
        />

        {/* Title Container */}
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            left: 50,
            zIndex: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "black",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(255, 255, 255, 0.8)",
            }}
          >
            UWU tuz przed....
          </Typography>
        </Box>
      </Box>
    </>
  );
};
