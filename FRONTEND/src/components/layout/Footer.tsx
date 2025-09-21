import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component="div"
              fontWeight="bold"
              gutterBottom
            >
              BlogTech
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create beautiful blogs that fit your style. Choose from a
              selection of easy-to-use templates and share your thoughts with
              the world.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                href="#"
                aria-label="Facebook"
                sx={{ color: "text.secondary" }}
              >
                <Facebook size={18} />
              </IconButton>
              <IconButton
                size="small"
                href="#"
                aria-label="Twitter"
                sx={{ color: "text.secondary" }}
              >
                <Twitter size={18} />
              </IconButton>
              <IconButton
                size="small"
                href="#"
                aria-label="Instagram"
                sx={{ color: "text.secondary" }}
              >
                <Instagram size={18} />
              </IconButton>
              <IconButton
                size="small"
                href="#"
                aria-label="LinkedIn"
                sx={{ color: "text.secondary" }}
              >
                <Linkedin size={18} />
              </IconButton>
              <IconButton
                size="small"
                href="#"
                aria-label="GitHub"
                sx={{ color: "text.secondary" }}
              >
                <Github size={18} />
              </IconButton>
            </Stack>
          </Grid>

          {/* Product Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              color="text.primary"
            >
              Product
            </Typography>
            <Stack spacing={1}>
              <MuiLink
                component={Link}
                to="/about"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                About
              </MuiLink>
              <MuiLink
                component={Link}
                to="/features"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Features
              </MuiLink>
              <MuiLink
                component={Link}
                to="/pricing"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Pricing
              </MuiLink>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Templates
              </MuiLink>
            </Stack>
          </Grid>

          {/* Community Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              color="text.primary"
            >
              Community
            </Typography>
            <Stack spacing={1}>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Blog
              </MuiLink>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Forums
              </MuiLink>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Developers
              </MuiLink>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Discord
              </MuiLink>
            </Stack>
          </Grid>

          {/* Support Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              color="text.primary"
            >
              Support
            </Typography>
            <Stack spacing={1}>
              <MuiLink
                component={Link}
                to="/contact"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Contact Us
              </MuiLink>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Help Center
              </MuiLink>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Documentation
              </MuiLink>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Status
              </MuiLink>
            </Stack>
          </Grid>

          {/* Legal Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              color="text.primary"
            >
              Legal
            </Typography>
            <Stack spacing={1}>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Terms of Service
              </MuiLink>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Privacy Policy
              </MuiLink>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                Cookie Policy
              </MuiLink>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                underline="none"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                GDPR
              </MuiLink>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Copyright Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} BlogTech. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ for bloggers worldwide
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
