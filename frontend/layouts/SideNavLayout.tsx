import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { HomeIcon } from "../icons/home";
import { ThunderboltIcon } from "../icons/thunderbolt";
import { CredentialsIcon } from "../icons/credentials";

export default function SideNavLayout() {
  const [isExpanded, setIsExpanded] = useState(false);

  const btnWidth = isExpanded ? "190px" : "60px";

  return (
    <Flex w="100%" h="90vh">
      <Flex
        boxShadow="base"
        direction="column"
        alignItems="flex-start"
        gap={3}
        p={4}
        position="relative"
      >
        <Box
          as="button"
          position="absolute"
          left="100%"
          top="80px"
          w="20px"
          h="40px"
          boxShadow="base"
          onClick={() => setIsExpanded((p) => !p)}
        >
          {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </Box>

        <Tooltip
          label={isExpanded ? "Add Workflow" : ""}
          hasArrow
          placement="right"
          borderRadius={3}
        >
          <Link to="/add">
            <Button
              leftIcon={<AddIcon w={6} />}
              w={btnWidth}
              justifyContent="flex-start"
            >
              {isExpanded && "Add Workflow"}
            </Button>
          </Link>
        </Tooltip>

        {[
          { label: "Home", icon: HomeIcon, link: "/dashboard" },
          {
            label: "Your workflows",
            icon: ThunderboltIcon,
            link: "/workflows",
          },
          { label: "Credentials", icon: CredentialsIcon, link: "/credentials" },
        ].map((elem) => (
          <Tooltip
            key={elem.label}
            label={!isExpanded && elem.label}
            hasArrow
            placement="right"
            borderRadius={3}
          >
            <Link to={elem.link}>
              <Button
                justifyContent="flex-start"
                w={btnWidth}
                variant="ghost"
                leftIcon={<elem.icon boxSize={6} />}
                colorScheme="gray"
              >
                {isExpanded && elem.label}
              </Button>
            </Link>
          </Tooltip>
        ))}
      </Flex>
      <Outlet />
    </Flex>
  );
}
