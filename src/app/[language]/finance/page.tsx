import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import FooterLink from "@/components/footer-link";
import { Trans } from "react-i18next/TransWithoutContext";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "finance");

  return {
    title: t("title"),
  };
}

export default async function Finance(props: Props) {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "finance");

  return (
    <Container maxWidth="md">
      <Grid
        container
        spacing={3}
        wrap="nowrap"
        pt={3}
        direction="column"
        sx={{ height: "90vh", justifyContent: "space-between" }}
      >
        <Grid size="grow">
          <Typography variant="h3" data-testid="finance-title" gutterBottom>
            {t("title")}
          </Typography>
          <Typography>
            <Trans
              i18nKey={`description`}
              t={t}
            />
          </Typography>
        </Grid>
      </Grid>
      <FooterLink />
    </Container>
  );
}
