export interface SubtitleOptions {
  fontName: string;
  fontSize: number;
  primaryColour: string;
  backColour: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  outline: number;
  outlineColour: string;
  shadow: number;
  shadowColour: string;
  marginL: number;
  marginR: number;
  marginV: number;
  alignment: number;
  borderStyle: number;
}

const defaultStyles: SubtitleOptions = {
  fontName: "Arial",
  fontSize: 15,
  primaryColour: "&H00FFFFFF",
  backColour: "&HFF0000FF",
  bold: false,
  italic: false,
  underline: false,
  outline: 1,
  outlineColour: "&H00000000",
  shadow: 1,
  shadowColour: "&H808080",
  marginL: 10,
  marginR: 10,
  marginV: 20,
  alignment: 2,
  borderStyle: 1,
};
