import React from "react";
import {RenderElementProps, useSlateStatic} from "slate-react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import {styled} from "@mui/material";
import {toggleLink} from "./helpers";


const LinkContainer = styled('div')`
  display: inline;
  position: relative;

  .popup {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    background-color: white;
    padding: 6px 10px;
    gap: 10px;
    border-radius: 6px;
    border: 1px solid lightgray;

    a {
      display: flex;
      align-items: center;
      gap: 5px;
      padding-right: 10px;
      border-right: 1px solid lightgrey;
    }

    button {
      border: none;
      background: transparent;

      :hover {
        color: rebeccapurple;
        cursor: pointer;
      }
    }
  }
`

export const LinkElement: React.FC<RenderElementProps> = ({attributes, element, children}) => {
    const editor = useSlateStatic();
    // const selected = useSelected();
    // const focused = useFocused();

    const [isPopupOpen, setIsPopupOpen] = React.useState(false);

    return (
        <ClickAwayListener onClickAway={() => setIsPopupOpen(false)}>
            <LinkContainer>
                <a {...attributes} href={element.url} onClick={() => setIsPopupOpen(ipo => !ipo)}>
                    {children}
                </a>
                {isPopupOpen && (
                    <div className="popup" contentEditable={false}>
                        <a href={element.url} rel="noreferrer" target="_blank">
                            {element.url}
                        </a>
                        <button onClick={() => toggleLink(editor)}>
                            <LinkOffIcon/>
                        </button>
                    </div>
                )}
            </LinkContainer>
        </ClickAwayListener>
    );
};