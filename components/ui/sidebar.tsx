"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children, open: openProp, setOpen: setOpenProp, animate = true }: { children: React.ReactNode; open?: boolean; setOpen?: React.Dispatch<React.SetStateAction<boolean>>; animate?: boolean }) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>{children}</SidebarContext.Provider>;
};

export const Sidebar = ({ children, open, setOpen, animate }: { children: React.ReactNode; open?: boolean; setOpen?: React.Dispatch<React.SetStateAction<boolean>>; animate?: boolean }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          // UBAH: Hapus bg-neutral-800 default, ganti transparent agar ikut parent (Glassmorphism)
          "h-full px-4 py-4 hidden md:flex md:flex-col w-[250px] shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "250px" : "80px") : "250px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div className={cn("h-14 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-[#0A0A0A] border-b border-white/10 w-full z-50 sticky top-0")} {...props}>
        <div className="flex justify-start z-20 w-full">
          <span className="font-bold text-white text-sm">Menu Admin</span>
        </div>

        <div className="flex justify-end z-20 w-full">
          <IconMenu2 className="text-neutral-200" onClick={() => setOpen(!open)} />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn("fixed h-full w-full inset-0 bg-[#0A0A0A]/95 backdrop-blur-xl p-10 z-[100] flex flex-col justify-between", className)}
            >
              <div className="absolute right-6 top-6 z-50 text-neutral-200 bg-white/10 p-2 rounded-full" onClick={() => setOpen(!open)}>
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// UBAH: LinkProps agar support Next.js Link
interface SidebarLinkProps extends LinkProps {
  link: Links;
  className?: string;
  children?: React.ReactNode; // Tambahkan children agar tidak error jika ada props tambahan
  [key: string]: any; // Allow any other props
}

export const SidebarLink = ({ link, className, ...props }: SidebarLinkProps) => {
  const { open, animate } = useSidebar();

  // UBAH: Gunakan Link dari 'next/link' bukan <a> tag biasa
  return (
    <Link href={link.href} className={cn("flex items-center justify-start gap-3 group/sidebar py-3 px-3 rounded-xl transition-all duration-200", className)} {...props}>
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-400 group-hover/sidebar:text-white text-sm font-medium whitespace-pre inline-block !p-0 !m-0 transition-colors"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
