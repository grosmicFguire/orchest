import { useFetcher } from "@/hooks/useFetcher";
import { HEADER, validURL } from "@orchest/lib-utils";
import React from "react";
import { NOTIFICATION_END_POINT } from "../common";
import { SubscriberPayload } from "./useCreateWebhook";

export const useVerifyWebhookUrl = (
  subscriberPayload: Omit<SubscriberPayload, "url">
) => {
  const [webhookUrl, setWebhookUrl] = React.useState("");

  const { data = false, status, fetchData, error } = useFetcher(
    validURL(webhookUrl, true)
      ? `${NOTIFICATION_END_POINT}/subscribers/webhooks/pre-creation-test-ping-delivery`
      : undefined,
    {
      transform: () => true,
      method: "POST",
      headers: HEADER.JSON,
      body: JSON.stringify({
        ...subscriberPayload,
        url: webhookUrl,
      }),
      disableFetchOnMount: true,
    }
  );

  const isSslAllowed = React.useMemo(() => {
    return webhookUrl.startsWith("https");
  }, [webhookUrl]);

  return {
    webhookUrl,
    setWebhookUrl,
    isUrlVerified: data,
    verifyUrl: fetchData,
    status,
    error,
    isSslAllowed,
  };
};
