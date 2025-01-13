import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Minus, Plus, X } from "lucide-react";
import { CartItemType } from "@/app/[language]/cart/types";
import { useTranslation } from "@/services/i18n/client";

type CartItemProps = {
  item: CartItemType;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const { t } = useTranslation("cart");
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{
            width: 100,
            height: 100,
            objectFit: "cover",
            borderRadius: 1
          }}
        />
        
        <Box flex={1}>
          <Typography variant="h6">{item.name}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {item.description}
          </Typography>
          {item.date && (
            <Typography variant="body2">
              {t("date")}: {item.date}
            </Typography>
          )}
          {item.duration && (
            <Typography variant="body2">
              {t("duration")}: {item.duration}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onQuantityChange(item.id, Math.max(0, item.quantity - 1))}
          >
            <Minus size={16} />
          </IconButton>
          <Typography>{item.quantity}</Typography>
          <IconButton
            size="small"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            <Plus size={16} />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: "right", minWidth: 100 }}>
          <Typography variant="h6">
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${item.price.toFixed(2)} {t("each")}
          </Typography>
        </Box>

        <IconButton onClick={() => onRemove(item.id)}>
          <X size={16} />
        </IconButton>
      </CardContent>
    </Card>
  );
}