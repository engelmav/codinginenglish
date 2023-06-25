import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Payment() {
  const router = useRouter();
  useEffect(() => router.push("https://buy.stripe.com/6oE3gh6lmazE1Da7st"));
  return <div>hi</div>;
}
