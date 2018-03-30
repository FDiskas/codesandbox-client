import * as React from 'react';
import { getModulePath } from 'common/sandbox/modules';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import getType from 'app/utils/get-type';
import { Module, Directory } from 'app/store/modules/editor/types';

import { Container, Chevron, FileName, StyledExitZen } from './elements';

type Props = {
    currentModule: Module;
    modules: Module[];
    directories: Directory[];
    workspaceHidden: boolean;
    toggleWorkspace: () => void;
    exitZenMode: () => void;
};

export default class FilePath extends React.Component<Props> {
    state = {
        hovering: false
    };

    onMouseEnter = () => {
        this.setState({ hovering: true });
    };

    onMouseLeave = () => {
        this.setState({ hovering: false });
    };

    render() {
        const { currentModule, modules, directories, workspaceHidden, toggleWorkspace, exitZenMode } = this.props;
        const path = getModulePath(modules, directories, currentModule.id);

        const pathParts = path.split('/');
        const fileName = pathParts.pop();
        const directoryPath = pathParts.join('/').replace(/\/$/, '').replace(/^\//, '');

        return (
            <Container onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Chevron
                    onClick={toggleWorkspace}
                    workspacehidden={String(workspaceHidden)}
                    hovering={String(!workspaceHidden || this.state.hovering)}
                />
                <FileName hovering={!workspaceHidden || this.state.hovering}>
                    <EntryIcons type={getType(currentModule.title, currentModule.code)} />
                    <span style={{ marginLeft: '0.25rem' }}>{fileName}</span>
                    <span style={{ marginLeft: '.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>{directoryPath}</span>
                </FileName>

                <StyledExitZen onClick={exitZenMode} />
            </Container>
        );
    }
}
