import { Gender } from "../../interfaces/Gender";

export function translateGender(gender: Gender) {
  switch (gender) {
    case Gender.MALE:
      return "Männlich";
    case Gender.FEMALE:
      return "Weiblich";
    case Gender.DIVERS:
      return "Divers";
    case Gender.UNSPECIFIED:
      return "Unspezifiziert";
  }
}
