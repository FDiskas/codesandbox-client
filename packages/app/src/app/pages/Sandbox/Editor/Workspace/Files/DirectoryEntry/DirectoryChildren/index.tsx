import * as React from 'react';
import getType from 'app/utils/get-type';
import validateTitle from '../validateTitle';
import Entry from '../Entry';
import DirectoryEntry from '../';
import { Directory, Module, SandboxError, Correction } from 'app/store/modules/editor/types'

type Props = {
  directories: Directory[]
  modules: Module[]
  depth: number
  renameModule: (id: string, shortid: string) => void
  openMenu: () => void
  setCurrentModule: (moduleId: string) => void
  parentShortid: string
  sandboxId: string
  mainModuleId: string
  sandboxTemplate: string
  deleteEntry: (shortid: string, title: string) => void
  currentModuleId: string
  isInProjectView: boolean
  markTabsNotDirty: () => void
  errors: SandboxError[]
  corrections: Correction[]
  changedModuleShortids: string[]
}

class DirectoryChildren extends React.Component<Props> {
  validateTitle = (id, title) => {
    return !!validateTitle(id, title);
  };

  render() {
    const {
      depth = 0,
      renameModule,
      openMenu,
      setCurrentModule,
      directories,
      parentShortid,
      sandboxId,
      mainModuleId,
      sandboxTemplate,
      modules,
      deleteEntry,
      currentModuleId,
      isInProjectView,
      markTabsNotDirty,
      errors,
      corrections,
      changedModuleShortids,
    } = this.props;

    return (
      <div>
        {directories
          .filter(x => x.directoryShortid === parentShortid)
          .map(dir => (
            <DirectoryEntry
              key={dir.id}
              depth={depth + 1}
              id={dir.id}
              shortid={dir.shortid}
              title={dir.title}
              sandboxId={sandboxId}
              sandboxTemplate={sandboxTemplate}
              mainModuleId={mainModuleId}
              modules={modules}
              directories={directories}
              currentModuleId={currentModuleId}
              isInProjectView={isInProjectView}
              markTabsNotDirty={markTabsNotDirty}
              errors={errors}
              corrections={corrections}
              changedModuleShortids={changedModuleShortids}
            />
          ))}
        {modules.filter(x => x.directoryShortid === parentShortid).map(m => {
          const isActive = m.id === currentModuleId;
          const mainModule = m.id === mainModuleId;
          const type = getType(m.title, m.code);

          const hasError =
            m && errors.filter(error => error.moduleId === m.id).length;

          return (
            <Entry
              key={m.id}
              id={m.id}
              shortid={m.shortid}
              title={m.title}
              depth={depth + 1}
              active={isActive}
              type={type || 'function'}
              rename={mainModule ? undefined : renameModule}
              openMenu={openMenu}
              deleteEntry={mainModule ? undefined : deleteEntry}
              isNotSynced={changedModuleShortids.indexOf(m.shortid) >= 0}
              renameValidator={this.validateTitle}
              setCurrentModule={setCurrentModule}
              isInProjectView={isInProjectView}
              isMainModule={mainModule}
              moduleHasError={hasError}
              markTabsNotDirty={markTabsNotDirty}
            />
          );
        })}
      </div>
    );
  }
}

export default DirectoryChildren
