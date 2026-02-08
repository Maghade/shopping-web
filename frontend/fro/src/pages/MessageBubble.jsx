import { Check, CheckCheck, Download } from "lucide-react";

const MessageBubble = ({ msg, isOwn }) => {
  const bubbleClass = isOwn
    ? "bg-green-500 text-white ml-auto"
    : "bg-white text-black mr-auto";

  const renderFile = () => {
    const fileUrl = `http://localhost:4000${msg.fileUrl}`;

    if (msg.type === "image") {
      return (
        <div className="relative">
          <img
            src={fileUrl}
            alt={msg.fileName}
            className="rounded-lg max-w-[250px] cursor-pointer"
            onClick={() => window.open(fileUrl, "_blank")}
          />
          <a href={fileUrl} download className="absolute bottom-1 right-1">
            <Download size={18} />
          </a>
        </div>
      );
    }

    if (msg.type === "video") {
      return <video src={fileUrl} controls className="max-w-[250px]" />;
    }

    if (msg.type === "audio") {
      return <audio src={fileUrl} controls />;
    }

    return (
      <a
        href={fileUrl}
        download
        className="underline text-sm flex items-center gap-1"
      >
        <Download size={16} />
        {msg.fileName}
      </a>
    );
  };

  return (
    <div className={`p-2 rounded-xl max-w-[70%] ${bubbleClass}`}>
      {msg.type === "text" ? <p>{msg.content}</p> : renderFile()}

      {/* Read receipts */}
      {isOwn && (
        <div className="flex justify-end mt-1">
          {msg.status === "read" ? (
            <CheckCheck size={16} className="text-blue-600" />
          ) : (
            <Check size={16} />
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;