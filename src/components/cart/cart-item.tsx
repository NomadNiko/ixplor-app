import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Minus, Plus, X } from "lucide-react";
import { CartItemType } from "@/app/[language]/cart/types";
import { useTranslation } from "@/services/i18n/client";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

type CartItemProps = {
  item: CartItemType;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const { t } = useTranslation("cart");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent 
        sx={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row", 
          alignItems: "center", 
          gap: isMobile ? 1 : 2,
          position: "relative",
          px: isMobile ? 1 : 2,
          py: isMobile ? 1 : 2
        }}
      >
        {/* Remove button for mobile - positioned absolutely */}
        {isMobile && (
          <IconButton 
            onClick={() => onRemove(item.id)} 
            sx={{ 
              position: "absolute", 
              top: 4, 
              right: 4, 
              zIndex: 1 
            }}
          >
            <X size={16} />
          </IconButton>
        )}

        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{
            width: isMobile ? 80 : 100,
            height: isMobile ? 80 : 100,
            objectFit: "cover",
            borderRadius: 1,
            mb: isMobile ? 1 : 0
          }}
        />
        
        <Box 
          flex={1} 
          sx={{ 
            width: "100%", 
            textAlign: isMobile ? "center" : "left",
            mb: isMobile ? 1 : 0,
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 0.5 : 0
          }}
        >
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            {item.name}
          </Typography>
          <Typography 
            variant={isMobile ? "caption" : "body2"} 
            color="text.secondary" 
            gutterBottom
            sx={{ 
              display: "block",
              width: "100%",
              wordWrap: "break-word"
            }}
          >
            {item.description}
          </Typography>
          {item.date && (
            <Typography 
              variant={isMobile ? "caption" : "body2"}
              sx={{ 
                display: "block",
                width: "100%"
              }}
            >
              {t("date")}: {item.date}
            </Typography>
          )}
          {item.duration && (
            <Typography 
              variant={isMobile ? "caption" : "body2"}
              sx={{ 
                display: "block",
                width: "100%"
              }}
            >
              {t("duration")}: {item.duration}
            </Typography>
          )}
        </Box>

        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            gap: 1,
            mb: isMobile ? 1 : 0,
            order: isMobile ? 1 : 0
          }}
        >
          <IconButton
            size="small"
            onClick={() => onQuantityChange(item.id, Math.max(0, item.quantity - 1))}
          >
            <Minus size={16} />
          </IconButton>
          <Typography variant={isMobile ? "body2" : "body1"}>
            {item.quantity}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            <Plus size={16} />
          </IconButton>
        </Box>

        <Box 
          sx={{ 
            textAlign: isMobile ? "center" : "right", 
            minWidth: isMobile ? "100%" : 100,
            mb: isMobile ? 1 : 0
          }}
        >
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
          <Typography 
            variant={isMobile ? "caption" : "body2"} 
            color="text.secondary"
          >
            ${item.price.toFixed(2)} {t("each")}
          </Typography>
        </Box>

        {/* Remove button for desktop */}
        {!isMobile && (
          <IconButton onClick={() => onRemove(item.id)}>
            <X size={16} />
          </IconButton>
        )}
      </CardContent>
    </Card>
  );
}