import { colors } from "../lib/constants";

export const layout = {
  page: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  shell: {
    width: "100%" as const,
    maxWidth: 720,
    alignSelf: "center" as const,
    paddingHorizontal: 16,
  },
  control: {
    width: "100%" as const,
    minHeight: 44,
    borderWidth: 1,
    borderColor: "rgba(201,146,42,0.45)",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    fontSize: 18,
    color: colors.ink,
  },
  button: {
    width: "100%" as const,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: colors.gold,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: colors.cocoa,
  },
};
